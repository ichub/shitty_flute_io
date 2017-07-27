"""
USAGE: python flootify.py video_id
prints icompositionstate json to standard output
"""

import vamp
import librosa
import numpy as np
import math
import sys
import subprocess
from __future__ import print_function

# set globals
n_notes = 24
json_for_id = [None] * n_notes

# load note info strings into json_for_id
def makeINoteInfo(note_id, name, label, noteType, soundFileUrl, shittySoundFileUrl):
    template = "{{\"noteId\": {0}, \"name\": \"{1}\", \"label\": \"{2}\", \"type\": \"{3}\", \"soundFileUrl\": \"{4}\", \"shittySoundFileUrl\": \"{5}\"}}"
    json_for_id[note_id] = template.format(note_id, name, label, noteType, soundFileUrl, shittySoundFileUrl)
        
makeINoteInfo(0, "C4", "C", "regular", "/res/notes/one-lined/C-Normal.mp3", "/res/notes/one-lined/C-Shitty.mp3"),
makeINoteInfo(1, "Cs4", "Cs", "flat", "/res/notes/one-lined/Cs-Normal.mp3", "/res/notes/one-lined/Cs-Shitty.mp3"),
makeINoteInfo(2, "D4", "D", "regular", "/res/notes/one-lined/D-Normal.mp3", "/res/notes/one-lined/D-Shitty.mp3"),
makeINoteInfo(3, "Ds4", "Ds", "flat", "/res/notes/one-lined/Ds-Normal.mp3", "/res/notes/one-lined/Ds-Shitty.mp3"),
makeINoteInfo(4, "E4", "E", "regular", "/res/notes/one-lined/E-Normal.mp3", "/res/notes/one-lined/E-Shitty.mp3"),
makeINoteInfo(5, "F4", "F", "regular", "/res/notes/one-lined/F-Normal.mp3", "/res/notes/one-lined/F-Shitty.mp3"),
makeINoteInfo(6, "Fs4", "Fs", "flat", "/res/notes/one-lined/Fs-Normal.mp3", "/res/notes/one-lined/Fs-Shitty.mp3"),
makeINoteInfo(7, "G4", "G", "regular", "/res/notes/one-lined/G-Normal.mp3", "/res/notes/one-lined/G-Shitty.mp3"),
makeINoteInfo(8, "Gs4", "Gs", "flat", "/res/notes/one-lined/Gs-Normal.mp3", "/res/notes/one-lined/Gs-Shitty.mp3"),
makeINoteInfo(9, "A4", "A", "regular", "/res/notes/one-lined/A-Normal.mp3", "/res/notes/one-lined/A-Shitty.mp3"),
makeINoteInfo(10, "As4", "As", "flat", "/res/notes/one-lined/As-Normal.mp3", "/res/notes/one-lined/As-Shitty.mp3"),
makeINoteInfo(11, "B4", "B", "regular", "/res/notes/one-lined/B-Normal.mp3", "/res/notes/one-lined/B-Shitty.mp3"),
makeINoteInfo(12, "C5", "C", "regular", "/res/notes/two-lined/High-C-Normal.mp3", "/res/notes/two-lined/High-C-Shitty.mp3"),
makeINoteInfo(13, "Cs5", "Cs", "flat", "/res/notes/two-lined/High-Cs-Normal.mp3", "/res/notes/two-lined/High-Cs-Shitty.mp3"),
makeINoteInfo(14, "D5", "D", "regular", "/res/notes/two-lined/High-D-Normal.mp3", "/res/notes/two-lined/High-D-Shitty.mp3"),
makeINoteInfo(15, "Ds5", "Ds", "flat", "/res/notes/two-lined/High-Ds-Normal.mp3", "/res/notes/two-lined/High-Ds-Shitty.mp3"),
makeINoteInfo(16, "E5", "E", "regular", "/res/notes/two-lined/High-E-Normal.mp3", "/res/notes/two-lined/High-E-Shitty.mp3"),
makeINoteInfo(17, "F5", "F", "regular", "/res/notes/two-lined/High-F-Normal.mp3", "/res/notes/two-lined/High-F-Shitty.mp3"),
makeINoteInfo(18, "Fs5", "Fs", "flat", "/res/notes/two-lined/High-Fs-Normal.mp3", "/res/notes/two-lined/High-Fs-Shitty.mp3"),
makeINoteInfo(19, "G5", "G", "regular", "/res/notes/two-lined/High-G-Normal.mp3", "/res/notes/two-lined/High-G-Shitty.mp3"),
makeINoteInfo(20, "Gs5", "Gs", "flat", "/res/notes/two-lined/High-Gs-Normal.mp3", "/res/notes/two-lined/High-Gs-Shitty.mp3"),
makeINoteInfo(21, "A5", "A", "regular", "/res/notes/two-lined/High-A-Normal.mp3", "/res/notes/two-lined/High-A-Shitty.mp3"),
makeINoteInfo(22, "As5", "As", "flat", "/res/notes/two-lined/High-As-Normal.mp3", "/res/notes/two-lined/High-As-Shitty.mp3"),
makeINoteInfo(23, "B5", "B", "regular", "/res/notes/two-lined/High-B-Normal.mp3", "/res/notes/two-lined/High-B-Shitty.mp3")

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

    def json_for_comp_note(comp_note):
    if comp_note is None:
        return ""
    template = "{{\"noteInfo\": {0}, \"start\": {1}, \"end\": {2}}}"
    return template.format(json_for_id[comp_note.note_id], comp_note.start, comp_note.end)
    
# json serialization of notes compositions
def json_array_for_notes(comp_notes):
    ret = "["
    
    for i in range(len(comp_notes)):
        ret += json_for_comp_note(comp_notes[i])
        if i < len(comp_notes) - 1:
            ret += ","
    
    ret += "]"
    return ret
    
def json_state_for_comp(comp_notes, video_id):
    ret = "{"
    ret += "\"compName\": \"\","
    ret += "\"youtubeVideoId\": \"" + video_id + "\","
    ret += "\"recordingYoutubeStartTime\": 0,"
    ret += "\"recordingYoutubeEndTime\": 200,"
    ret += "\"startRecordingDateTime\": 0,"
    ret += "\"lastEdited\": 0,"
    ret += "\"viewCount\": 0,"
    ret += "\"offset\": 0,"
    ret += "\"hasRecorded\": true,"
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
	subprocess.run("youtube-dl -o " + youtube_id + ".wav -x --audio-format \"wav\" " + youtube_url, shell=True)

	audio_file = "./" + youtube_id + ".wav"
	audio, sr = librosa.load(audio_file, sr=44100, mono=True)

	subprocess.run("rm ./" + youtube_id + ".wav", shell=True)

	# run melodia algorithm to get pitch array
	params = {"minfqr": 100.0, "maxfqr": 800.0, "voicing": 100.0, "minpeaksalience": 0.0}
	data = vamp.collect(audio, sr, "mtg-melodia:melodia")
	hop, melody = data['vector']
	timestamps = 8 * 128/44100.0 + np.arange(len(melody)) * (128/44100.0) # first timestamp is 8 * 128/44100 for whatever reason
	melody_pos = melody[:]
	melody_pos[melody<=0] = None
	melody_cents_scaled = 12*np.log2(melody/130.813) # how many hundred cents above C3
	melody_cents_scaled[melody<=0] = None

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
	            i += 75 # all notes should be at least 75 ticks long
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
	    note.end = note.end + (note.end - note.start) * 0.1 + np.random.normal(0.05, 0.05) 
	    note.start = note.start + np.random.normal(0, 0.02)

	# print to standard output
	print(json_state_for_comp(comp_notes), youtube_id)
