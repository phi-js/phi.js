export default function filterIconValue(value) {
  let mimetypes = {
    "unknown": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/unknown.png",
    "application/octet-stream": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/application-octet-stream.png",
    "application/pdf": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/application-pdf.png",
    "audio/x-m4a": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/audio-x-wav.png",
    "image/gif": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/image-x-generic.png",
    "image/jpeg": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/image-x-generic.png",
    "image/jpg": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/image-x-generic.png",
    "image/png": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/image-x-generic.png",
    "multipart/form-data": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/text-plain.png",
    "text/plain": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/text-x-hex.png",
    "video/amr": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/video-x-generic.png",
    "video/mp4": "https://raw.githubusercontent.com/pasnox/oxygen-icons-png/master/oxygen/128x128/mimetypes/video-x-generic.png",
  };

  return typeof mimetypes[value] != "undefined" ? mimetypes[value] : mimetypes["unknown"];
}