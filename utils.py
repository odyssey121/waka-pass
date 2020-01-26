import time
from datetime import datetime
import pytz


def hms_to_m(s):
    t = 0
    for u in s.split(':'):
        t = 60 * t + int(u)
    return t


def make_delta(*args):
    times = []
    for time in args:
        sh, sm = time.split(':')
        times.append(int(sm) + 60 * int(sh))
    diff = times[1] - times[0]
    return "{}:{}".format(diff // 60, diff % 60)


get_time = lambda t: time.strftime("%H:%M", time.localtime(t))

get_today = lambda: datetime.today().strftime("%d/%m/%Y")

# print(get_today()[3:])
