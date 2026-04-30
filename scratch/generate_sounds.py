import wave
import math
import struct
import os

def generate_tone(filename, duration, freq, volume=0.5, sample_rate=22050):
    n_samples = int(sample_rate * duration)
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        for i in range(n_samples):
            # Basic sine wave with some harmonics for richness
            val = math.sin(2.0 * math.pi * freq * i / sample_rate) * 0.7
            val += math.sin(4.0 * math.pi * freq * i / sample_rate) * 0.2
            val += math.sin(1.0 * math.pi * freq * i / sample_rate) * 0.1
            
            sample = int(val * volume * 32767)
            f.writeframesraw(struct.pack('<h', sample))

def generate_engine_loop(filename, duration, base_freq=60, sample_rate=22050):
    n_samples = int(sample_rate * duration)
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        for i in range(n_samples):
            # Engine noise: rough square/sawtooth mix
            t = i / sample_rate
            # Phasing harmonics
            val = (math.sin(2.0 * math.pi * base_freq * t) > 0) * 0.4
            val += math.sin(2.0 * math.pi * (base_freq*0.5) * t) * 0.3
            val += (math.random() if hasattr(math, 'random') else (i % 100 / 100.0)) * 0.1 # Noise
            
            # Simple pseudo-random noise for "rumble"
            noise = (i * 123.456 % 2) - 1.0
            val = (val * 0.8 + noise * 0.2)
            
            sample = int(val * 0.3 * 32767)
            f.writeframesraw(struct.pack('<h', sample))

def generate_noise(filename, duration, volume=0.3, type='white', sample_rate=22050):
    n_samples = int(sample_rate * duration)
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        for i in range(n_samples):
            noise = ( (i * 1103515245 + 12345) & 0x7fffffff ) / 0x7fffffff
            noise = (noise * 2.0) - 1.0
            
            # Fade out for short effects
            fade = 1.0 - (i / n_samples)
            sample = int(noise * volume * fade * 32767)
            f.writeframesraw(struct.pack('<h', sample))

def generate_click(filename, sample_rate=22050):
    duration = 0.05
    n_samples = int(sample_rate * duration)
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        for i in range(n_samples):
            val = math.sin(2.0 * math.pi * 1000 * i / sample_rate)
            fade = 1.0 - (i / n_samples)
            sample = int(val * 0.5 * fade * 32767)
            f.writeframesraw(struct.pack('<h', sample))

output_dir = 'game-frontend/assets/sounds'
os.makedirs(output_dir, exist_ok=True)

# 1. Engine Loop
generate_engine_loop(f'{output_dir}/engine_loop.wav', 2.0)
# 2. Start (short pitch up)
generate_tone(f'{output_dir}/engine_start.wav', 0.8, 100, volume=0.4)
# 3. Stop (short pitch down)
generate_tone(f'{output_dir}/engine_stop.wav', 0.8, 40, volume=0.4)
# 4. Action sounds (Noise based)
generate_noise(f'{output_dir}/plow.wav', 0.5, volume=0.4)
generate_noise(f'{output_dir}/harrow.wav', 0.4, volume=0.3)
generate_noise(f'{output_dir}/seed.wav', 0.2, volume=0.2)
generate_noise(f'{output_dir}/harvest.wav', 0.6, volume=0.5)
generate_noise(f'{output_dir}/fuel.wav', 1.0, volume=0.3)
# 5. UI sounds
generate_click(f'{output_dir}/click.wav')
generate_tone(f'{output_dir}/menu.wav', 0.2, 440, volume=0.2)
generate_tone(f'{output_dir}/buy.wav', 0.3, 880, volume=0.3)

print("Sons gerados com sucesso!")
