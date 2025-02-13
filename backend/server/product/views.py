from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializer import ProductSerializer

# endpoints


@api_view(['GET'])
def get_products(request):
    Products = Product.objects.all()
    serializedData = ProductSerializer(Products, many=True).data
    return Response(serializedData)


@api_view(['POST'])
def create_product(request):
    data = request.data
    serializer = ProductSerializer(data=data)
    if serializer.is_valid():
        serializer.save()  # save the data to the database
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        data = request.data
        serializer = ProductSerializer(product, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
