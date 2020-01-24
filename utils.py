import time
from datetime import datetime


def make_delta(*args):
    times = []
    for time in args:
        sh, sm = time.split(':')
        times.append(int(sm) + 60 * int(sh))
    diff = times[1] - times[0]
    return "{}:{}".format(diff // 60, diff % 60)


get_time = lambda t: time.strftime("%H:%M", time.localtime(t))

get_today = lambda: datetime.today().strftime("%d/%m/%Y")
