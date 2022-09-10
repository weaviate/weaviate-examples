import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
def to_raw(string):
    return fr"{string}"

#Function to generate spectrogram for uploaded audio 
def create_spectrogram(path_to_img,path_to_save):
    y, sr = librosa.load(path_to_img)
    # Default FFT window size
    n_fft = 2048 # FFT window size
    hop_length = 512 # number audio of frames between STFT columns (looks like a good default)
    audio_file, _ = librosa.effects.trim(y)
    D = np.abs(librosa.stft(audio_file, n_fft = n_fft, hop_length = hop_length))

    window_size = 2048
    window = np.hanning(window_size)
    stft  = librosa.core.spectrum.stft(y, n_fft=2048, hop_length=512, window=window)
    out = 2 * np.abs(stft) / np.sum(window)

    # For plotting headlessly
    from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
    S = librosa.feature.melspectrogram(y, sr=sr)
    S_DB = librosa.amplitude_to_db(S, ref=np.max)
    fig = plt.figure(figsize = (16, 6))
    canvas = FigureCanvas(fig)
    ax = fig.add_subplot(111)
    librosa.display.specshow(S_DB, sr=sr, hop_length=hop_length);
    fig.savefig(path_to_save+'/spec.png')
