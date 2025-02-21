from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import StudyGoal
from .serializers import StudyGoalSerializer

class StudyGoalView(APIView):
    def get(self, request):
        goals = StudyGoal.objects.all()
        serializer = StudyGoalSerializer(goals, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StudyGoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from django.http import JsonResponse

def study_goals(request):
    return JsonResponse({"message": "Study goals endpoint"})
