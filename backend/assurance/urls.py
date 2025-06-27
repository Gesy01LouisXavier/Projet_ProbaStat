from django.urls import path
from .views import ImportCSVView, CalculReservesView

urlpatterns = [
    path('import-csv/', ImportCSVView.as_view(), name='import-csv'),
    path('calcul-reserves/', CalculReservesView.as_view(), name='calcul-reserves'),
] 