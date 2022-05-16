import csv, json
from geojson import Feature, FeatureCollection, Point

csvFilePath = "/Users/cpapalaz/Desktop/Mangrove_Countries.csv"
jsonFilePath = "/Users/cpapalaz/Desktop/Mangrove_Countries.json"

#read csv file and add to data
features = []
with open(csvFilePath, newline='', encoding='latin1') as csvfile:
    print(csvfile)
    reader = csv.reader(csvfile, dialect=csv.excel, delimiter=',')
    next(reader, None)  # skip the headers
    for Country,Mangroves,Latitude,Longitude,MIN_POINT_X,MAX_POINT_X,MIN_POINT_Y,MAX_POINT_Y in reader:
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

collection = FeatureCollection(features)
with open(jsonFilePath, "w") as f:
    f.write('%s' % collection)