"""
USAGE: python flootify.py video_id
prints icompositionstate json to standard output
"""

from __future__ import print_function
import vamp
import librosa
import numpy as np
import math
import sys
import subprocess
import time
import os

current_milli_time = lambda: int(round(time.time() * 1000))

# set globals
n_notes = 28
json_for_id = [line.rstrip('\n') for line in open(os.getcwd() + "/scripts/notes.txt")] 
# getcwd() should refer to the home directory of the project, where gulp/forever process is run from

# convert pitches into discrete notes
def cents_to_note_id(hundred_cents):
    return round(hundred_cents) - 12

# basic data structure for notes
class CompositionNote:
    
    def __init__(self, note_id, start, end):
        self.note_id = note_id
        self.start = start
        self.end = end
        
    @staticmethod
    def make_composition_note(note_id, start, end):
        if note_id < -12 or note_id >= n_notes + 12:
            return None
        if note_id < 0:
            note_id += 12
        if note_id >= n_notes:
            note_id -= 12
        return CompositionNote(note_id, start, end)
    
    def __str__(self):
        return "{\n\tnote_id: " + str(self.note_id) + "\n\tstart: " + str(self.start) + "\n\tend: " + str(self.end) + "\n}\n"
    
# json serialization of notes compositions
def json_for_comp_note(comp_note):
    if comp_note is None:
        return ""
    template = "{{\"noteInfo\": {0}, \"start\": {1}, \"end\": {2}}}"
    return template.format(json_for_id[comp_note.note_id], comp_note.start, comp_note.end)

def json_array_for_notes(comp_notes):
    ret = "["
    
    for i in range(len(comp_notes)):
        ret += json_for_comp_note(comp_notes[i])
        if i < len(comp_notes) - 1:
            ret += ","
    
    ret += "]"
    return ret
    
def json_state_for_comp(comp_notes, video_id, duration):
    ret = "{"
    ret += "\"compName\": \"\","
    ret += "\"youtubeVideoId\": \"" + video_id + "\","
    ret += "\"recordingYoutubeStartTime\": 0,"
    ret += "\"recordingYoutubeEndTime\": " + str(duration) + ","
    ret += "\"startRecordingDateTime\": 0,"
    ret += "\"lastEdited\": " + str(current_milli_time()) + ","
    ret += "\"viewCount\": 0,"
    ret += "\"pitchShift\": 0,"
    ret += "\"hasRecorded\": true,"
    ret += "\"autoRecorded\": true,"
    ret += "\"notes\": "
    ret += json_array_for_notes(comp_notes)
    ret += "}"
    return ret

# convert a youtube id into a url
def url_from_id(youtube_id):
    return "https://www.youtube.com/watch?v=" + youtube_id

if __name__ == "__main__":
	# download temp .wav audio file, read it into audio variable, delete temp .wav file
	youtube_id = sys.argv[1]
	youtube_url = url_from_id(youtube_id)
	subprocess.run("youtube-dl -q -o " + youtube_id + ".wav -x --audio-format \"wav\" " + youtube_url, shell=True)

	audio_file = "./" + youtube_id + ".wav"
	audio, sr = librosa.load(audio_file, sr=44100, mono=True)

	subprocess.run("rm ./" + youtube_id + ".wav", shell=True)

	# run melodia algorithm to get pitch array
	params = {"minfqr": 100.0, "maxfqr": 800.0, "voicing": 100.0, "minpeaksalience": 0.0}
	data = vamp.collect(audio, sr, "mtg-melodia:melodia")
	hop, melody = data['vector']
	timestamps = 8 * 128/44100.0 + np.arange(len(melody)) * (128/44100.0) # first timestamp is 8 * 128/44100 for whatever reason
	duration = timestamps[-1]
	melody[melody <= 0] = 1
	melody_cents_scaled = 12*np.log2(melody/130.813) # how many hundred cents above C3
	melody_cents_scaled[melody<=1] = None

	# convert into array of notes
	current_id = None
	current_start = 0.
	comp_notes = []
	i = 0
	while i < len(melody_cents_scaled):
	    this_id = cents_to_note_id(melody_cents_scaled[i])
	    if math.isnan(this_id):
	        this_id = None
	    else:
	        this_id = int(this_id)
	    if current_id is None:
	        if this_id is not None:
	            current_start = timestamps[i]
	            current_id = this_id
	            i += 250 # all notes should be at least 250 ticks long
	    else:
	        if this_id is None or this_id != current_id:
	            if this_id is None and np.random.random() < 0.998:
		            # if you're currently playing a note and hit an empty stretch,
		            # you'll usually keep playing the note for ~500 ticks
	                i += 1
	                continue
	            start = current_start
	            end = timestamps[i]
	            comp_note = CompositionNote.make_composition_note(current_id, start * 1000, end * 1000)
	            # composition note schema on server side is in ms, not s
	            if comp_note is not None:
	                comp_notes = comp_notes + [comp_note]
	            current_start = timestamps[i]
	            current_id = this_id
	            i += 75
	    i += 1
	if current_id is not None:
	    comp_notes = comp_notes + [CompositionNote.make_composition_note(current_id, start, timestamps[-1])]

	# make notes a little more natural/shitty?
	for note in comp_notes:
		# make notes about 0.1s + 10% longer, then add noise to both start and end times
	    note.end = note.end + (note.end - note.start) * 0.05 + np.random.normal(0.02, 0.02) 
	    note.start = note.start + np.random.normal(0, 0.02)

	# print to standard output
	print(json_state_for_comp(comp_notes, youtube_id, duration))
