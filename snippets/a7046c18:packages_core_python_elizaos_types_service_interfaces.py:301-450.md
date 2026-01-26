# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    words: list[TranscriptionWord] | None = None
    confidence: float | None = None


class SpeechToTextOptions(BaseModel):
    """Options for speech-to-text."""

    language: str | None = None
    model: str | None = None
    continuous: bool | None = None
    interim_results: bool | None = None
    max_alternatives: int | None = None


class TextToSpeechOptions(BaseModel):
    """Options for text-to-speech."""

    voice: str | None = None
    model: str | None = None
    speed: float | None = None
    format: Literal["mp3", "wav", "flac", "aac"] | None = None
    response_format: Literal["mp3", "opus", "aac", "flac"] | None = None


class VoiceInfo(BaseModel):
    """Voice information for TTS."""

    id: str = Field(..., description="Voice ID")
    name: str = Field(..., description="Voice name")
    language: str = Field(..., description="Voice language")
    gender: Literal["male", "female", "neutral"] | None = None


class ITranscriptionService(Service):
    """Interface for transcription and speech services."""

    service_type: ClassVar[str] = ServiceType.TRANSCRIPTION

    @property
    def capability_description(self) -> str:
        return "Audio transcription and speech processing capabilities"

    @abstractmethod
    async def transcribe_audio(
        self, audio_path: str | bytes, options: TranscriptionOptions | None = None
    ) -> TranscriptionResult:
        """Transcribe audio file to text."""
        ...

    @abstractmethod
    async def transcribe_video(
        self, video_path: str | bytes, options: TranscriptionOptions | None = None
    ) -> TranscriptionResult:
        """Transcribe video file to text."""
        ...

    @abstractmethod
    async def speech_to_text(
        self, audio_stream: BufferedReader | bytes, options: SpeechToTextOptions | None = None
    ) -> TranscriptionResult:
        """Real-time speech to text."""
        ...

    @abstractmethod
    async def text_to_speech(self, text: str, options: TextToSpeechOptions | None = None) -> bytes:
        """Convert text to speech."""
        ...

    @abstractmethod
    async def get_supported_languages(self) -> list[str]:
        """Get supported languages for transcription."""
        ...

    @abstractmethod
    async def get_available_voices(self) -> list[VoiceInfo]:
        """Get available voices for TTS."""
        ...

    @abstractmethod
    async def detect_language(self, audio_path: str | bytes) -> str:
        """Detect language of audio file."""
        ...


# ============================================================================
# Video Interfaces
# ============================================================================


class VideoFormat(BaseModel):
    """Video format information."""

    format_id: str = Field(..., description="Format ID")
    url: str = Field(..., description="Download URL")
    extension: str = Field(..., description="File extension")
    quality: str = Field(..., description="Quality label")
    file_size: int | None = None
    video_codec: str | None = None
    audio_codec: str | None = None
    resolution: str | None = None
    fps: int | None = None
    bitrate: int | None = None


class VideoInfo(BaseModel):
    """Video information."""

    url: str = Field(..., description="Video URL")
    title: str | None = None
    duration: float | None = None
    thumbnail: str | None = None
    description: str | None = None
    uploader: str | None = None
    view_count: int | None = None
    upload_date: datetime | None = None
    formats: list[VideoFormat] | None = None


class VideoDownloadOptions(BaseModel):
    """Video download options."""

    format: str | None = None
    quality: str | None = None
    output_path: str | None = None
    audio_only: bool | None = None
    video_only: bool | None = None
    subtitles: bool | None = None
    embed_subs: bool | None = None
    write_info_json: bool | None = None


class VideoProcessingOptions(BaseModel):
    """Video processing options."""

    start_time: float | None = None
    end_time: float | None = None
    output_format: str | None = None
    resolution: str | None = None
    bitrate: str | None = None
    framerate: int | None = None
    audio_codec: str | None = None
    video_codec: str | None = None


class IVideoService(Service):
    """Interface for video processing services."""

    service_type: ClassVar[str] = ServiceType.VIDEO

    @property
```