from rest_framework import serializers
from .models import Product

# turn the model into a json object


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
