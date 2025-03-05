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
        product_id = self.request.query_params.get('id', None)
        sort_field = self.request.query_params.get('sortField', None)
        sort_order = self.request.query_params.get('sortOrder', 'asc')
        
        # Handle ID filter
        if product_id:
            return queryset.filter(id=product_id)
        
        # Handle search
        if search:
            queryset = queryset.filter(
                Q(barcode__icontains=search) |
                Q(number__icontains=search) |
                Q(qty__icontains=search) |
                Q(date__icontains=search)
            )
        
        # Handle sorting
        if sort_field:
            # Add minus sign for descending order
            order_by = f"-{sort_field}" if sort_order == 'desc' else sort_field
            queryset = queryset.order_by(order_by)
        else:
            # Default sorting by id
            queryset = queryset.order_by('date')
            
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # If ID was provided in query params, return single object
        product_id = self.request.query_params.get('id', None)
        if product_id and queryset.exists():
            serializer = self.get_serializer(queryset.first())
            return Response({
                'results': [serializer.data]  # Wrap in list to maintain consistent format
            })

        #paginate_queryset will call StandardPagination
        page = self.paginate_queryset(queryset)    #handle page 2..
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Fallback for non-paginated case (shouldn't happen with pagination_class)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': queryset.count(),
        })

    def post(self, request, *args, **kwargs):
        """
        Handles product creation. Uses the same ProductSerializer for validation and saving.
        """
        print('post request', request.data)
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        """
        Handles product updates. Expects product ID in the URL and updated data in request body.
        """
        # Get product ID from URL parameters
        product_id = kwargs.get('pk') or request.query_params.get('id')
        if not product_id:
            return Response(
                {'error': 'Product ID is required for updates'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get the product instance
            product = Product.objects.get(pk=product_id)
            
            # Update the product with new data
            serializer = ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Product.DoesNotExist:
            return Response(
                {'error': f'Product with ID {product_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to update product: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



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
