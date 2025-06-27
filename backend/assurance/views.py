from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
import pandas as pd
from .models import Assure, Sinistre
from django.utils.dateparse import parse_date
import numpy as np
from django.db import models

# Create your views here.

class ImportCSVView(APIView):
    def post(self, request, format=None):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'Aucun fichier fourni.'}, status=status.HTTP_400_BAD_REQUEST)
        df = pd.read_csv(file)
        for _, row in df.iterrows():
            assure, _ = Assure.objects.get_or_create(
                id_assure=row['ID_Assuré'],
                defaults={
                    'periode_exposition': row['Période_exposition'],
                    'age': row['Âge'],
                    'sexe': row['Sexe'],
                    'experience': row['Expérience'],
                    'type_vehicule': row['Type_véhicule'],
                    'zone_geographique': row['Zone_géographique'],
                    'usage': row['Usage'],
                    'historique': row.get('Historique', '')
                }
            )
            if not Sinistre.objects.filter(assure=assure).exists() and row['Nb_sinistres'] > 0:
                for i in range(int(row['Nb_sinistres'])):
                    Sinistre.objects.create(
                        assure=assure,
                        date_sinistre=parse_date(row.get('Date_sinistre', '2024-01-01')),
                        montant=row['Montant_total'] / row['Nb_sinistres']
                    )
        return Response({'message': 'Importation réussie.'}, status=status.HTTP_201_CREATED)

class CalculReservesView(APIView):
    def get(self, request, format=None):
        # 1. Fréquence des sinistres (lambda)
        n_assures = Assure.objects.count()
        n_sinistres = Sinistre.objects.count()
        lambda_hat = n_sinistres / n_assures if n_assures > 0 else 0

        # 2. Paramètres log-normale (mu, sigma^2)
        sinistres_montants = list(Sinistre.objects.values_list('montant', flat=True))
        if sinistres_montants:
            log_montants = np.log([m for m in sinistres_montants if m > 0])
            mu_hat = float(np.mean(log_montants))
            sigma2_hat = float(np.var(log_montants))
        else:
            mu_hat = 0
            sigma2_hat = 0

        # 3. Espérance et variance du coût d'un sinistre
        E_X = np.exp(mu_hat + sigma2_hat / 2)
        Var_X = np.exp(2 * mu_hat + sigma2_hat) * (np.exp(sigma2_hat) - 1) if sigma2_hat > 0 else 0

        # 4. Espérance et variance du coût total annuel par assuré
        E_Y = lambda_hat * E_X
        Var_Y = lambda_hat * Var_X + lambda_hat * (E_X ** 2)

        # 5. RBNS : somme des sinistres déclarés non réglés (ici, tous les sinistres)
        rbns_total = float(np.sum(sinistres_montants))

        # 6. IBNR : estimation statistique (sinistres attendus mais non encore déclarés)
        # On estime le coût attendu pour les sinistres non encore déclarés sur la base du modèle
        # IBNR = (E[Y] * n_assures) - rbns_total, mais doit être >= 0
        ibnr_total = max((E_Y * n_assures) - rbns_total, 0)

        # 7. IBNER : ajustement 5% du total RBNS+IBNR
        ibner_total = 0.05 * (rbns_total + ibnr_total)

        # 8. Total
        total = rbns_total + ibnr_total + ibner_total

        return Response({
            'lambda_hat': lambda_hat,
            'mu_hat': mu_hat,
            'sigma2_hat': sigma2_hat,
            'E_X': E_X,
            'Var_X': Var_X,
            'E_Y': E_Y,
            'Var_Y': Var_Y,
            'RBNS': rbns_total,
            'IBNR': ibnr_total,
            'IBNER': ibner_total,
            'Total': total
        })
