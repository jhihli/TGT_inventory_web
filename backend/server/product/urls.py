from django.urls import path
from .views import get_products, create_product, product_detail

urlpatterns = [
    # same function name as in views.py
    path('products/', get_products, name='get_products'),
    path('products/create/', create_product, name='create_product'),
    path('products/<int:pk>', product_detail, name='product_detail')
]
