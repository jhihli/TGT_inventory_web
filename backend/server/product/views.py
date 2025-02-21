from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializer import ProductSerializer
from rest_framework import generics
from django.db.models import Sum, Q
from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    page_size = 6  # Must match ITEMS_PER_PAGE
    page_size_query_param = 'page_size'
    max_page_size = 100
# endpoints
class ProductListAPIView(generics.ListAPIView):
    
    serializer_class = ProductSerializer
    pagination_class = StandardPagination
    
    def get_queryset(self):
        queryset = Product.objects.all()
        search = self.request.query_params.get('search', None)
       
        if search:
            # OR condition across barcode, number, qty, and date
            queryset = queryset.filter(
                Q(barcode__icontains=search) |
                Q(number__icontains=search) |
                Q(qty__icontains=search) |
                Q(date__icontains=search)
            )
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        #paginate_queryset will call StandardPagination
        page = self.paginate_queryset(queryset)    #handle page 2..
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Fallback for non-paginated case (shouldn’t happen with pagination_class)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': queryset.count(),
        })

    def post(self, request, *args, **kwargs):
        """
        Handles product creation. Uses the same ProductSerializer for validation and saving.
        """
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
