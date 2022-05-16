import csv, json
from geojson import Feature, FeatureCollection, Point

csvFilePath = "/Users/cpapalaz/Desktop/Mangrove_Countries.csv"
jsonFilePath = "/Users/cpapalaz/Desktop/Mangrove_Countries.json"

#read csv file and add to data
features = []
with open(csvFilePath, newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for country, mangroves, latitude, longitude, minpt_x, maxpt_x, minpt_y, maxpt_y in reader:
        latitude, longitude, minpt_x, maxpt_x, minpt_y, maxpt_y = map(float, (latitude, longitude, minpt_x, maxpt_x, minpt_y, maxpt_y))
        features.append(
            Feature(
                bbox = [minpt_x, maxpt_x, minpt_y, maxpt_y],
                geometry = Point((longitude, latitude)),
                properties = {
                    "country": country,
                    "mangroves": mangroves
                }
            )
        )

collection = FeatureCollection(features)
with open(jsonFilePath, "w") as f:
    f.write('%s' % collection)