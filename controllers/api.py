# Here go your api methods.

#Gets all bikes from the database
def get_bikes():
    results = []
    rows = db().select(db.bike.ALL)
    for row in rows:
        results.append(dict(
            bike_id = row.id,
            bike_brand = row.Brand,
            bike_name = row.Name,
            bike_desc = row.Description,
            bike_img_url = row.ImageURL
        ))
    return response.json(dict(bikes_list=results))

#Gets bike based on bike id
def get_bike():
    bike_id = int(request.vars.bike_id)
    # row = db().select(db.bike.id == bike_id)
    for row in db(db.bike.id == bike_id).select():
        result = dict(
            bike_id = row.id,
            bike_brand = row.Brand,
            bike_name = row.Name,
            bike_desc = row.Description,
            bike_img_url = row.ImageURL
        )
    return response.json(dict(bike=result))