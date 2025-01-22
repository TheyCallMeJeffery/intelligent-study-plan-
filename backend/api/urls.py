from django.urls import path
from .views import StudyGoalView, ScheduleView, PredictStudyHoursView, SignUpView

urlpatterns = [
    
    path('study-goals/', StudyGoalView.as_view(), name='study-goals'),

    
    path('schedule/', ScheduleView.as_view(), name='schedule'),

    
    path('predict/', PredictStudyHoursView.as_view(), name='predict_study_hours'),

    
    path('signup/', SignUpView.as_view(), name='signup'),
]
