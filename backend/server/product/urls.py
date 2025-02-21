from django.urls import path
from .views import ProductListAPIView, create_product, product_detail

urlpatterns = [
    # same function name as in views.py
    path('products/', ProductListAPIView.as_view(), name='get_products'),
    path('products/<int:pk>', product_detail, name='product_detail')
]
