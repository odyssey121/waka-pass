
from app import db, Day, User
# time.strftime("%H:%M", time.localtime(time.time()))
# d = Day()
# db.session.add(d)
# db.session.commit()

# {"data":[{"date":"01/2020","last_name":"shirnin","running_min":32}]}

user = User(name='alexey', last_name='shirnin',api_key='2ecd6997-1aae-446b-97ad-4435ddc1aae6')
db.session.add(user)
db.session.commit()