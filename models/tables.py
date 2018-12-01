# auth.enable_record_versioning(db)

import datetime

def get_user_email():
    return None if auth.user is None else auth.user.email

def get_current_time():
    return datetime.datetime.utcnow()

db.define_table('bike',
                Field('Brand'),
                Field('Name'),
                Field('Description'),
                Field('ImageURL')
                )

db.define_table('review',
                Field('title'),
                Field('body', 'text'),
                Field('username', default=get_user_email()),
                Field('post_time', 'datetime', default=get_current_time()),
                Field('bike_id', 'reference bike')
                )

db.define_table('post',
                Field('post_author', default=get_user_email()),
                Field('post_title'),
                Field('post_content', 'text'),
                Field('post_time', 'datetime', default=get_current_time()),
                Field('bike_id', 'reference bike'),
                )

db.define_table('reply',
                Field('reply_author', default=get_user_email()),
                Field('post_id', 'reference post'),
                Field('reply_content', 'text'),
                Field('reply_time', 'datetime', default=get_current_time()),
                )

# Thumbs
db.define_table('thumb',
                Field('user_email'), # The user who thumbed, easier to just write the email here.
                Field('post_id', 'reference post'), # The thumbed post
                Field('thumb_state'), # This can be 'u' for up or 'd' for down, or None for... None.
                )
