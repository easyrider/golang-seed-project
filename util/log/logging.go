package log

import (
	"io/ioutil"
	"log"
	"os"
	"path"
)

var (
	LogDir string = "/var/log/"
	TRACE         = log.New(ioutil.Discard, "TRACE ", log.Ldate|log.Ltime|log.Lshortfile)
	INFO          = log.New(ioutil.Discard, "INFO  ", log.Ldate|log.Ltime|log.Lshortfile)
	WARN          = log.New(ioutil.Discard, "WARN  ", log.Ldate|log.Ltime|log.Lshortfile)
	ERROR         = log.New(os.Stderr, "ERROR ", log.Ldate|log.Ltime|log.Lshortfile)
)

func Init(logdir string) {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	LogDir = logdir

	TRACE = NewLogger("trace", "trace.log")
	INFO = NewLogger("info", "trace.log")
	WARN = NewLogger("warn", "warn.log")
	ERROR = NewLogger("error", "error.log")
}

// Create a logger using log.* directives in app.conf plus the current settings
// on the default logger.
// Code based on code from the Revel framework (http://robfig.github.io/revel/)
func NewLogger(name string, output string) *log.Logger {
	var logger *log.Logger

	switch output {
	case "stdout":
		logger = log.New(os.Stdout, "", log.Ldate|log.Ltime|log.Lshortfile)
	case "stderr":
		logger = log.New(os.Stderr, "", log.Ldate|log.Ltime|log.Lshortfile)
	default:
		if output == "off" {
			output = os.DevNull
		}

		logger = log.New(GetLogFile(output), "", log.Ldate|log.Ltime|log.Lshortfile)
	}

	// Set the prefix / flags.
	// flags, found := Config.Int("log." + name + ".flags")
	// if found {
	// 	logger.SetFlags(flags)
	// }

	// prefix, found := Config.String("log." + name + ".prefix")
	// if found {
	// 	logger.SetPrefix(prefix)
	// }

	return logger
}

func GetLogFile(filename string) *os.File {
	file, err := os.OpenFile(path.Join(LogDir, filename), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalln("Failed to open log file", filename, ":", err)
	}

	return file
}
