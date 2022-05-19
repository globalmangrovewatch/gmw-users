import csv
from geojson import Feature, FeatureCollection, Point

csv_file_path = "Mangrove_Countries.csv"
json_file_path = "mrtt-ui/src/data/mangrove_countries.json"

#read csv file and add to data
features = []
with open(csv_file_path, newline='', encoding='latin1') as csvfile:
    reader = csv.reader(csvfile, dialect=csv.excel, delimiter=',')
    next(reader, None)  # skip the headers
    for row in reader:
        Country, Mangroves, Latitude, Longitude, MIN_POINT_X, MAX_POINT_X, MIN_POINT_Y, MAX_POINT_Y = row
        if Mangroves[0] == "1":
            Latitude, Longitude = map(float, (Latitude, Longitude))
            features.append(
            Feature(
                bbox= [MIN_POINT_X, MIN_POINT_Y, MAX_POINT_X, MAX_POINT_Y],
                geometry = Point((Longitude, Latitude)),
                properties = {
                    'country': Country,
                    'mangroves': Mangroves
                }
            )
        )
        else:
            pass

collection = FeatureCollection(features)
with open(json_file_path, "w") as f:
    f.write('%s' % collection)