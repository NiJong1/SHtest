import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { CheckCircle, Target, Calendar, Share2, XCircle, List, Gift, Edit3 } from "lucide-react";

export default function ChallengeApp() {
  const [steps, setSteps] = useState(0);
  const [day, setDay] = useState(1);
  const [history, setHistory] = useState(Array.from({ length: 21 }, () => ({ steps: null, status: null })));
  const [showOverview, setShowOverview] = useState(false);
  const [device, setDevice] = useState("RunningPad Pro");
  const [editDay, setEditDay] = useState(null);
  const [editSteps, setEditSteps] = useState(0);

  const goal = 7000;
  const progress = Math.min((steps / goal) * 100, 100);

  const completeDay = (stepsCount, customDay = null) => {
    const updated = [...history];
    const targetIndex = customDay !== null ? customDay : day - 1;
    const status = stepsCount >= goal ? "✅ Gehaald" : "❌ Niet gehaald";
    updated[targetIndex] = { steps: stepsCount, status };
    setHistory(updated);

    if (customDay === null && day < 21) {
      setDay(day + 1);
      setSteps(0);
    }
  };

  const handleSubmit = () => {
    if (steps >= goal) {
      completeDay(steps);
    }
  };

  const handleSkip = () => {
    completeDay(0);
  };

  const handleShareWhatsapp = () => {
    const message = `Ik zit nu op dag ${day} van de 21-dagen challenge met ${steps} stappen! (${device})`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, "_blank");
  };

  const totalCompleted = history.filter((h) => h.status === "✅ Gehaald").length;
  const totalMissed = history.filter((h) => h.status === "❌ Niet gehaald").length;

  // Cashback berekening afhankelijk van gekozen apparaat
  const cashbackValues = {
    "RunningPad Pro": 125,
    "WALKR Pro": 84,
  };
  const maxCashback = cashbackValues[device];

  // Cashback voortgang
  const cashbackProgress = (totalCompleted / 21) * 100;
  const cashbackEarned = (totalCompleted / 21) * maxCashback;

  const handleEditSubmit = () => {
    if (editDay !== null) {
      completeDay(editSteps, editDay);
      setEditDay(null);
      setEditSteps(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <motion.h1
        className="text-3xl font-bold mb-4 text-green-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        21-Dagen Challenge
      </motion.h1>

      <div className="mb-6 w-full max-w-md">
        <label className="block font-semibold mb-2">Kies je apparaat:</label>
        <div className="flex space-x-2">
          {Object.keys(cashbackValues).map((name) => (
            <Button
              key={name}
              variant={device === name ? "default" : "outline"}
              className="flex-1"
              onClick={() => setDevice(name)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      {showOverview ? (
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Overzicht voortgang</h2>
            <div className="flex justify-between text-sm mb-4">
              <span>✅ Gehaald: {totalCompleted}</span>
              <span>❌ Niet gehaald: {totalMissed}</span>
              <span>⏳ Open: {21 - (totalCompleted + totalMissed)}</span>
            </div>
            <ul className="grid grid-cols-3 gap-2">
              {history.map((entry, index) => (
                <li
                  key={index}
                  className="border rounded-lg p-2 text-center text-sm bg-white flex flex-col items-center space-y-1"
                >
                  <div>Dag {index + 1}</div>
                  <div>{entry.status || "⏳ Nog niet afgerond"}</div>
                  {entry.steps !== null && (
                    <div className="text-xs text-gray-500">{entry.steps} stappen</div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditDay(index);
                      setEditSteps(entry.steps || 0);
                    }}
                    className="flex items-center space-x-1 mt-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Aanpassen</span>
                  </Button>
                </li>
              ))}
            </ul>

            {editDay !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4">
                  <h3 className="text-lg font-semibold">Dag {editDay + 1} aanpassen</h3>
                  <Input
                    type="number"
                    value={editSteps}
                    onChange={(e) => setEditSteps(Number(e.target.value))}
                    placeholder="Bijv. 7000"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleEditSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Bevestigen
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditDay(null)}
                      className="flex-1"
                    >
                      Annuleren
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowOverview(false)}
              className="w-full bg-green-600 hover:bg-green-700 mt-4"
            >
              Terug naar dag {day}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="text-green-600" />
                <span className="font-semibold">Dag {day} / 21</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="text-green-600" />
                <span className="font-semibold">{goal} stappen</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium">Voer je stappen in:</label>
              <Input
                type="number"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                placeholder="Bijv. 7200"
              />
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-4" />
              <p className="text-sm text-gray-600">
                {steps} / {goal} stappen
              </p>
            </div>

            {/* Cashback voortgang */}
            <div className="space-y-2 mt-4">
              <label className="font-medium flex items-center space-x-2">
                <Gift className="text-green-600" />
                <span>
                  Cashback voortgang: €{cashbackEarned.toFixed(2)} / €{maxCashback}
                </span>
              </label>
              <Progress value={cashbackProgress} className="h-3" />
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={steps < goal}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {steps >= goal ? (
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Dag afgerond!</span>
                  </span>
                ) : (
                  "Bevestig dag"
                )}
              </Button>

              <Button
                onClick={handleSkip}
                variant="destructive"
                className="w-full flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Dag overslaan</span>
              </Button>

              <Button
                onClick={handleShareWhatsapp}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Deel op WhatsApp</span>
              </Button>

              <Button
                onClick={() => setShowOverview(true)}
                variant="secondary"
                className="w-full flex items-center justify-center space-x-2"
              >
                <List className="w-5 h-5" />
                <span>Bekijk overzicht</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
