from rest_framework import serializers

from users.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "username"]

    def create(self, validated_data) -> User:
        return User.objects.create_user(**validated_data)
