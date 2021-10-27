from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
import uuid
from django.contrib.contenttypes.models import ContentType

class Author(AbstractUser):
  author_type = models.CharField(max_length=30,default="author", blank=False)
  author_id = models.UUIDField(primary_key = True , auto_created = True , default = uuid.uuid4)
  displayName = models.CharField(max_length=30, default="", blank=False, unique = True)
  host = models.CharField(max_length=50)
  url = models.URLField()
  github = models.CharField(null = True,blank=False, max_length=50)

#   profileImage = models.ImageField(upload_to = 'media', blank = True, null = True)
  #USERNAME_FIELD = 'username'
#   def photo_url(self):
#     if self.photo and hasattr(self.photo, 'url'):
#         return self.photo.url
#     else:
#         return '/media/user.jpg'

class PostInbox(models.Model):
    inbox_type = models.CharField(max_length=100, default="", blank=False)
    inbox_author_id = models.CharField(max_length=100, default="", blank=False,primary_key=True)


class LikeInbox(models.Model):
    inbox_type = models.CharField(max_length=100, default="", blank=False)
    inbox_author_id = models.CharField(max_length=100, default="", blank=False,primary_key=True)


class FollowInbox(models.Model):
    inbox_type = models.CharField(max_length=100, default="", blank=False)
    inbox_author_id = models.CharField(max_length=100, default="", blank=False,primary_key=True)


class Post(models.Model):
    class Visibility(models.TextChoices):
        PUBLIC='PUBLIC'
        PRIVATE='PRIVATE'
        FRIENDONLY='FRIENDS'

    class ContentType(models.TextChoices):
        MARKDOWN = 'text/markdown'
        PLAIN = 'text/plain'
        APPLICATION = 'application/base64'
        IMAGE_PNG = 'image/png;base64'
        IMAGE_JPEG = 'image/jpeg;base64'




    # items = models.ForeignKey(Inbox, related_name='items', on_delete=models.CASCADE)
    type = models.CharField(max_length=100, default="", blank=False,verbose_name="type")
    title = models.CharField(max_length=100, default="", blank=False)
    post_id = models.UUIDField(primary_key = True, auto_created = True , default = uuid.uuid4, editable = False,verbose_name="id")
    source = models.URLField(default="")
    origin = models.URLField(default="")
    description = models.TextField(default="")
    contentType = models.CharField(max_length=20, choices=ContentType.choices, default=ContentType.PLAIN)
    # image_content = models.FileField()
    # text_content = models.CharField(max_length=500, default='',blank=True, null=True)
    author = models.ForeignKey(Author,related_name='author',on_delete=models.CASCADE,default='')
    content=models.TextField()
    #categories = ArrayField(models.CharField(max_length=200), blank=True)
    #count = models.IntegerField()
    #scrcomment
    comments = models.URLField()
    published = models.DateTimeField(auto_now_add=True)#USE_TZ=True in settings.py
    visibility = models.CharField(max_length=20,choices=Visibility.choices , default=Visibility.PUBLIC)
    unlisted = models.BooleanField(default=False, null=False)


class Comment(models.Model):
    comment_type = models.CharField(max_length=100, default="", blank=False,verbose_name="type")
    comment_author = models.ForeignKey(Author,on_delete=models.CASCADE,default='',related_name='authors')
    comment = models.TextField(default="", blank=False)
    contentType = models.ForeignKey(ContentType,on_delete=models.CASCADE)
    published = models.DateTimeField(auto_now_add=True)
    comment_id = models.UUIDField(primary_key = True , auto_created = True , default = uuid.uuid4, editable = False,verbose_name="id") 
    comment_post = models.ForeignKey(Post,on_delete=models.CASCADE,default='',related_name='commentsSrc')

class Like(models.Model):
    items = models.ForeignKey(LikeInbox, related_name='like_items', on_delete=models.CASCADE)
    content = models.URLField(default="", blank=False,verbose_name="@context")
    summary = models.CharField(max_length=100, default="", blank=False)
    type = models.CharField(max_length=100, default="", blank=False)
    like_author = models.OneToOneField(Author,on_delete=models.CASCADE,verbose_name="author")
    object = models.URLField()

class Follower(models.Model):
    author_id = models.UUIDField(primary_key = True, default = uuid.uuid4)
