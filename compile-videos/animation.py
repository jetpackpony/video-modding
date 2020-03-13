
def get_legs_so_far(t, legs):
    res = []
    dur = 0
    for leg in legs:
        if dur <= t:
            res.append(leg)
        dur += leg[0]

    return res

def calc_frame(initial_value, legs, t):
    legs_so_far = get_legs_so_far(t, legs)
    leg = legs_so_far[-1]

    # If this is the first leg, use initial value, otherswise take the previous leg's
    current_value = initial_value if len(legs_so_far) == 1 else legs_so_far[-2][1]
    completed_legs_time = sum(map(lambda leg: leg[0], legs_so_far[:-1]))

    # In case time is after the last leg, return the last leg's value
    if completed_legs_time + leg[0] < t:
        return (current_value, leg, 1)

    time_fraction = (t - completed_legs_time) / leg[0]
    return (current_value, leg, time_fraction)

# leg = (duration, rotation)
# legs = [(1, 25), (1, 25), (1, 10)]
def make_rotation_function(initial_rotation, legs):
    def rotate(t):
        if not legs or len(legs) == 0:
            return initial_rotation
        (current_rotation, leg, time_fraction) = calc_frame(initial_rotation, legs, t)
        return current_rotation - (current_rotation - leg[1]) * time_fraction

    return rotate

# leg = (duration, position)
# legs = [(1, (100, 100)), (1, (100, 100)), (1, (200, 200))]
def make_position_function(initial_pos, legs):
    def move(t):
        if not legs or len(legs) == 0:
            return initial_pos
        (current_pos, leg, time_fraction) = calc_frame(initial_pos, legs, t)
        return (
            current_pos[0] - (current_pos[0] - leg[1][0]) * time_fraction,
            current_pos[1] - (current_pos[1] - leg[1][1]) * time_fraction
        )

    return move

'''
Usage example

from moviepy.editor import *
from animation import make_rotation_function, make_position_function

screensize = (320,240)

def make_head():
    rot0 = 35
    rot1 = 15
    rot2 = 5
    rot_legs = [(0.7, rot1), (1, rot1), (0.7, rot2)]

    pos0 = (-130, 160)
    pos1 = (-70, 120)
    pos2 = (0, 90)
    pos_legs = [(0.7, pos1), (1, pos1), (0.7, pos2)]

    headClip = (ImageClip("../graphics/head.png")
                   .set_position(make_position_function(pos2, None))
    #                 .set_position("center")
                   .set_duration(5)
                   .resize(height=150)
                   .fx(vfx.rotate, make_rotation_function(rot2, None), expand=True, resample="bilinear")
              )
    headClip.fps = 60
    return headClip

def make_hands():
    rot0 = 35
    rot1 = 15
    rot2 = 5
    rot_legs = [(0.7, rot1), (1, rot1), (0.7, rot2)]

    pos0 = (-130, 160)
    pos1 = (-70, 120)
    pos2 = (0, 90)
    pos_legs = [(0.7, pos1), (1, pos1), (0.7, pos2)]

    handsClip = (ImageClip("../graphics/sub-with-hands.png")
                   .set_position(make_position_function((150, 140), None))
#                     .set_position("center")
                   .set_duration(5)
                   .resize(height=80)
#                    .fx(vfx.rotate, make_rotation_function(rot0, rot_legs), expand=True, resample="bilinear")
              )
    handsClip.fps = 60
    return handsClip

cvc = CompositeVideoClip([make_head(), make_hands()], size=screensize)

cvc.ipython_display(autoplay=1, maxduration=600)
'''