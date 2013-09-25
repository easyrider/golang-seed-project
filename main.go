package main

import (
	"flag"
)

func main() {
	var (
		env  string = "dev"
		addr string = "localhost:3000"
	)

	// Parse args
	flag.StringVar(&env, "env", "dev", "")
	flag.StringVar(&addr, "addr", "localhost:3000", "")
	flag.Parse()

	server := NewServer(env, addr)
	StartServer(server)
}
