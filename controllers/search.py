def index():
    context = dict(message=T(request.vars['results']))
    return response.render('search.html', context)

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
