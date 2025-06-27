from django.db import models

# Create your models here.

class Assure(models.Model):
    id_assure = models.CharField(max_length=100, unique=True)
    periode_exposition = models.FloatField(help_text="Durée d'assurance en années")
    age = models.IntegerField()
    sexe = models.CharField(max_length=10)
    experience = models.IntegerField(help_text="Années de permis")
    type_vehicule = models.CharField(max_length=100)
    zone_geographique = models.CharField(max_length=100)
    usage = models.CharField(max_length=100)
    historique = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.id_assure

class Sinistre(models.Model):
    assure = models.ForeignKey(Assure, on_delete=models.CASCADE, related_name='sinistres')
    date_sinistre = models.DateField()
    montant = models.FloatField()

    def __str__(self):
        return f"Sinistre {self.id} - {self.assure.id_assure}"
