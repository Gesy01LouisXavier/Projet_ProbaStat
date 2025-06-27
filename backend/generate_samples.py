import csv
import random
from datetime import datetime, timedelta

# Valeurs possibles
sexes = ["Homme", "Femme"]
types_vehicule = ["Berline", "SUV", "Citadine", "Utilitaire", "Break", "Cabriolet"]
zones = ["Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Nantes", "Nice", "Toulouse", "Strasbourg", "Rennes"]
usages = ["Privé", "Professionnel"]
historiques = ["Bonus", "Malus", ""]

def random_date():
    start = datetime(2024, 1, 1)
    end = datetime(2024, 12, 31)
    delta = end - start
    return (start + timedelta(days=random.randint(0, delta.days))).strftime("%Y-%m-%d")

def make_row(i):
    id_assure = f"A{i:04d}"
    periode = round(random.uniform(0.5, 1), 2)
    nb_sinistres = random.choices([0, 1, 2, 3], weights=[0.6, 0.25, 0.1, 0.05])[0]
    montant = 0 if nb_sinistres == 0 else random.randint(500, 20000)
    age = random.randint(18, 70)
    sexe = random.choice(sexes)
    experience = random.randint(0, min(age-18, 40))
    type_vehicule = random.choice(types_vehicule)
    zone = random.choice(zones)
    usage = random.choice(usages)
    historique = random.choice(historiques)
    date_sinistre = "" if nb_sinistres == 0 else random_date()
    return [
        id_assure, periode, nb_sinistres, montant, age, sexe, experience,
        type_vehicule, zone, usage, historique, date_sinistre
    ]

header = ["ID_Assuré","Période_exposition","Nb_sinistres","Montant_total","Âge","Sexe","Expérience","Type_véhicule","Zone_géographique","Usage","Historique","Date_sinistre"]

for file_num in [1, 2]:
    with open(f"sample_data_{file_num}.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        for i in range(1, 1001):
            writer.writerow(make_row(i + (file_num-1)*1000))

print("2 fichiers CSV de 1000 lignes générés : sample_data_1.csv et sample_data_2.csv") 