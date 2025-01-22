from rest_framework import serializers
from .models import StudyGoal, UserSchedule


class StudyGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyGoal
        fields = '__all__'


class UserScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSchedule
        fields = '__all__'
