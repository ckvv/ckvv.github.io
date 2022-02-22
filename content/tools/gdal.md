---
title: "gdal命令"
tags: ['tool', 'gdal']
date: '2021-07-09'
---

## 类型转换

格式`ogr2ogr -f "fileType" fileName sourceFile`

数据库>geojson
```
ogr2ogr -f "GeoJSON" cn_polygon.geojson PG:"host=localhost dbname=postgres user=postgres password=password" -sql "select * from planet_osm_polygon limit 30000"
```

geojson>shp 
```
ogr2ogr -f "ESRI Shapefile" test.shp china_diaoyudao.geojson.json

```

## 数据入库
geojson>postgre
```
/usr/local/Cellar/gdal2/2.3.2_1/bin/ogr2ogr -dim XY -gt 65536 -skipfailures -progress --config OGR_FORCE_ASCII NO --config PG_USE_COPY YES -overwrite -f PostgreSQL  PG:"host=localhost port=5432 dbname=g-default user=projx password=sss"  -lco FID=_id -lco GEOMETRY_NAME=the_geom -nln ${表名} "${文件名}"
```
csv>postgre
```
/usr/local/Cellar/gdal2/2.3.2_1/bin/ogr2ogr -dim XY -gt 65536 -skipfailures --config PG_USE_COPY YES -overwrite -oo AUTODETECT_TYPE=YES -f PostgreSQL  PG:"host=localhost port=5432 dbname=g-default user=projx password=sss" -lco FID=_id -nln ${start.getTime()} ${start.getTime()}.CSV
```

## 查询大文件文件
```
ogr2ogr -f "GeoJson" -dialect sqlite -sql "select * from 'layer name' limit 10" sm.geojson 50m.geojson
查询信息
ogrinfo -al -so 900m.geojson

- sql
- dim 坐标维度设置
- skipfailures 失败后继续，跳过失败的功能
- gt 可以将n设置为unlimited以将数据加载到单个事务中。

```

## 查看文件元数据
```
ogrinfo -so -al file

```

ogr2ogr -dim XY -gt 65536 -progress --config OGR_FORCE_ASCII NO --config PG_USE_COPY YES -overwrite -f PostgreSQL  PG:"host=localhost port=5432 dbname=k_geo user=projx password=sss"  -lco FID=_id -lco GEOMETRY_NAME=the_geom -nln china "./map.shp"
