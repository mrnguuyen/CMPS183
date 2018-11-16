# auth.enable_record_versioning(db)
db.define_table('bike',
                Field('Brand'),
                Field('Name'),
                Field('Description'),
                Field('ImageURL')
                )

db.define_table('review',
                Field('title'),
                Field('content', 'text'),
                Field('bike_id', 'reference bike')
                )

