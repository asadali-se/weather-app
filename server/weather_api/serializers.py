from rest_framework import serializers

class WeatherDataSerializers(serializers.Serializer):
    city = serializers.CharField()
    temperature = serializers.FloatField()
    description = serializers.CharField()
    humidity = serializers.IntegerField()
    wind_speed = serializers.FloatField()
    