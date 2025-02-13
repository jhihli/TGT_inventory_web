from django.db import models

# Create your models here.


class Product(models.Model):
    number = models.CharField(max_length=50)
    qty = models.IntegerField()
    date = models.DateField()

    class Meta:
        db_table = "product"

    def __str__(self):
        return self.number
