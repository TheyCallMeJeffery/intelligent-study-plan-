from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.http import JsonResponse
import joblib
import numpy as np
from .models import StudyGoal, UserSchedule
from .serializers import StudyGoalSerializer, UserScheduleSerializer


model = joblib.load('./ml_model/study_model.pkl')  
scaler = joblib.load('./ml_model/scaler.pkl')  


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return JsonResponse({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already registered.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)


class PredictStudyHoursView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            extracurricular_hours = data.get('extracurricular_hours')
            sleep_hours = data.get('sleep_hours')
            stress_level = data.get('stress_level')

            
            if extracurricular_hours is None or sleep_hours is None or stress_level is None:
                return JsonResponse({'error': 'Invalid input data, all fields are required'}, status=status.HTTP_400_BAD_REQUEST)

           
            try:
                extracurricular_hours = float(extracurricular_hours)
                sleep_hours = float(sleep_hours)
                stress_level = float(stress_level)
            except ValueError:
                return JsonResponse({'error': 'Fields must be numeric values'}, status=status.HTTP_400_BAD_REQUEST)

            input_data = np.array([[extracurricular_hours, sleep_hours, stress_level]])
            input_scaled = scaler.transform(input_data)

          
            predicted_hours = model.predict(input_scaled)[0]

            return JsonResponse({'predicted_study_hours': predicted_hours}, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudyGoalView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        user = request.user  
        goals = StudyGoal.objects.filter(user=user)  
        serializer = StudyGoalSerializer(goals, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user  
        request.data['user'] = user.id  
        serializer = StudyGoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        user = request.user 
        schedules = UserSchedule.objects.filter(user=user)
        serializer = UserScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user 
        schedule_data = request.data
        schedule_data['user'] = user.id  
        
        serializer = UserScheduleSerializer(data=schedule_data)
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        schedule_id = request.data.get('id')  
        user = request.user
        if not schedule_id:
            return JsonResponse({'error': 'Schedule ID is required for updating.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            
            schedule = UserSchedule.objects.get(id=schedule_id, user=user)
            serializer = UserScheduleSerializer(schedule, data=request.data, partial=True)  
            if serializer.is_valid():
                serializer.save()  
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserSchedule.DoesNotExist:
            return JsonResponse({'error': 'Schedule not found or does not belong to the authenticated user.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        schedule_id = request.data.get('id')  
        user = request.user
        if not schedule_id:
            return JsonResponse({'error': 'Schedule ID is required for deletion.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            
            schedule = UserSchedule.objects.get(id=schedule_id, user=user)
            schedule.delete()  # Delete the schedule
            return JsonResponse({'message': 'Schedule deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except UserSchedule.DoesNotExist:
            return JsonResponse({'error': 'Schedule not found or does not belong to the authenticated user.'}, status=status.HTTP_404_NOT_FOUND)
