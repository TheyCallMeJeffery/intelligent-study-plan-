from django.urls import path
from .views import StudyGoalView

urlpatterns = [
    path('study-goals/', StudyGoalView.as_view(), name='study-goals'),
]
from django.urls import path, include

urlpatterns = [
    
    path('api/', include('api.urls')),
]
from django.urls import path
from .views import study_goals

urlpatterns = [
    path('study-goals/', study_goals, name='study_goals'),
]
