def get_user_email():
    return None if auth.user is None else auth.user.email

# auth.enable_record_versioning(db)
db.define_table('bike',
                Field('Brand'),
                Field('Name'),
                Field('Description'),
                Field('ImageURL')
                )

db.define_table('review',
                Field('username', default=get_user_email()),
                Field('title'),
                Field('body', 'text'),
                Field('bike_id', 'reference bike')
                )

