from django.db import models
from django.contrib.auth.models import User

class StudyGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    goal = models.CharField(max_length=255)
    hours_per_day = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.user.username}'s Goal: {self.goal}"

class UserSchedule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f'{self.user.username} - {self.subject} at {self.time}'
