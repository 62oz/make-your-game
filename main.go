package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
	"strconv"
)

func main() {
	// Launch server
	Server()
}

func Server() error {
	// Handle requests
	http.HandleFunc("/", ScoreHandler)
	log.Println("Starting server port 8080 (http://localhost:8080/)")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		return err
	}
	return nil
}

type ScoreContent struct {
	// Struct for received scores
	Name  string `json:"name"`
	Score int    `json:"score"`
}

var LeaderBoard []ScoreContent

func addFictionalScore() {
	// Add 40 fictional scores to leaderboard
	for i := 0; i < 40; i++ {
		LeaderBoard = append(LeaderBoard, ScoreContent{Name: "Player" + strconv.Itoa(i), Score: i})
	}
}

func ScoreHandler(w http.ResponseWriter, r *http.Request) {
	// Handle requests

	var NewScore ScoreContent

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

	if r.Method == "POST" {
		err := json.NewDecoder(r.Body).Decode(&NewScore)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	}

	if len(LeaderBoard) < 40 {
		addFictionalScore()
	}

	// Add new score to leaderboard
	if NewScore.Score >= 0 {
		LeaderBoard = append(LeaderBoard, NewScore)
	}

	// Sort leaderboard
	sort.Slice(LeaderBoard, func(i, j int) bool {
		return LeaderBoard[i].Score > LeaderBoard[j].Score
	})

	// Send leaderboard
	json.NewEncoder(w).Encode(LeaderBoard)
}
