# Generated by Django 4.2.1 on 2024-05-26 09:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_basket_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='basket',
            name='total_price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
