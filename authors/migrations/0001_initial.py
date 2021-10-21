# Generated by Django 3.2.8 on 2021-10-17 21:53

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('author_id', models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('author_type', models.CharField(default='', max_length=30)),
                ('host', models.GenericIPAddressField(default='127.0.0.1:5454', editable=False)),
                ('displayName', models.CharField(default='', max_length=30)),
                ('url', models.URLField()),
                ('github', models.SlugField(unique=True)),
                ('profileImage', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('post_id', models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='id')),
                ('post_type', models.CharField(default='', max_length=100, verbose_name='type')),
                ('title', models.CharField(default='', max_length=100)),
                ('source', models.URLField(default='')),
                ('origin', models.URLField(default='')),
                ('description', models.TextField(default='')),
                ('content', models.FileField(upload_to='')),
                ('count', models.IntegerField()),
                ('comments', models.URLField()),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('unlisted', models.BooleanField(default=False)),
                ('contentType', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('post_author', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='authors.author')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.URLField(default='', verbose_name='@context')),
                ('summary', models.CharField(default='', max_length=100)),
                ('type', models.CharField(default='', max_length=100)),
                ('object', models.URLField()),
                ('like_author', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='authors.author', verbose_name='author')),
            ],
        ),
        migrations.CreateModel(
            name='Inbox',
            fields=[
                ('inbox_types', models.CharField(blank=True, default='', max_length=100, null=True, verbose_name='type')),
                ('inbox_titles', models.CharField(blank=True, default='', max_length=500, null=True, verbose_name='title')),
                ('inbox_ids', models.URLField(default='', primary_key=True, serialize=False)),
                ('inbox_sources', models.URLField(default='')),
                ('inbox_origins', models.URLField(default='')),
                ('inbox_descriptions', models.CharField(blank=True, default='', max_length=500, null=True, verbose_name='description')),
                ('inbox_content_types', models.CharField(blank=True, default='', max_length=500, null=True, verbose_name='contentType')),
                ('inbox_contents', models.CharField(blank=True, default='', max_length=500, null=True, verbose_name='contentType')),
                ('inbox_comments', models.URLField()),
                ('inbox_published', models.DateTimeField(auto_now_add=True)),
                ('inbox_visibility', models.CharField(blank=True, default='', max_length=100, null=True, verbose_name='visibility')),
                ('inbox_unlisted', models.BooleanField(default=False)),
                ('inbox_authors', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='author', to='authors.author')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('comment_id', models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='id')),
                ('comment_type', models.CharField(default='', max_length=100, verbose_name='type')),
                ('comment', models.TextField(default='')),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('comment_author', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='authors.author')),
                ('comment_post', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='authors.post')),
                ('contentType', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
        ),
    ]