<<<<<<< HEAD
# auth.enable_record_versioning(db)
=======
# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.




# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)

>>>>>>> cee5351e83b62c36bb612b16826605ab94dd4169
db.define_table('bike',
                Field('Brand'),
                Field('Name'),
                Field('Description'),
                Field('ImageURL')
                )
