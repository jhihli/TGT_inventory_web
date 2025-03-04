from django.db import models

# Create your models here.


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    number = models.CharField(max_length=50, default='default_number')
    barcode = models.CharField(max_length=50, default='default_barcode')
    qty = models.IntegerField(default='default_qty')
    date = models.DateField(default='default_date')
    vender = models.CharField(max_length=10, default='default_vender')
    client = models.CharField(max_length=10, default='default_client')
    category = models.CharField(max_length=20, default='default_client')

    class Meta:
        db_table = "product"

    def __str__(self):
        return self.number
