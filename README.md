# README - Projet 9 : Développez une preuve de concept en IA

## 📖 Contexte du projet

Ce projet s'inscrit dans le cadre de ma formation en tant qu'AI Engineer. L'objectif est de démontrer la capacité d'identifier et de tester un modèle récent de machine learning via une preuve de concept. Le modèle sélectionné doit être comparé à une baseline et intégré dans un dashboard déployé sur le cloud.

## 🧠 Mission

L'entreprise DataSpace, spécialisée en data science, m'a confié la tâche de réaliser une preuve de concept pour évaluer un modèle innovant capable d'améliorer les performances d'une prédiction de séries temporelles. Cette preuve repose sur :

- Une veille technologique sur les modèles récents de machine learning
- L'implémentation d'un nouveau modèle et sa comparaison avec une baseline
- Le développement d'un dashboard interactif et accessible

## 📊 Dataset Utilisé

Le dataset provient de Kaggle et représente les ventes mensuelles de camions de janvier 2003 à décembre 2014.

- **Nombre d'échantillons** : 144
- **Colonnes** : `Date` et `Sales`
- **Particularité** : Données propres et sans anomalies, adaptées aux modèles de prévision temporelle.

## 🔍 Modèles de Machine Learning

Trois modèles ont été comparés :

### 1️⃣ **ARIMA (Auto-Regressive Integrated Moving Average)**

- Modèle traditionnel pour les séries temporelles
- Entraîné avec la bibliothèque `pmdarima`
- **Paramètres** : ARIMA(5,1,1)

### 2️⃣ **Chronos-Bolt-Base (Amazon Science)**

- Modèle basé sur l'architecture Transformer (T5) pour les séries temporelles
- Modèle préentraîné et utilisé via la bibliothèque `chronos`
- Capacité de fournir des prédictions probabilistes avec intervalles de confiance

### 3️⃣ **AutoGluon**

- Framework de machine learning automatique
- Utilisé pour automatiser la sélection et la comparaison des modèles
- Permet d'optimiser les hyperparamètres et de générer des prédictions avec moins d'efforts manuels

## ⚙️ Métriques de Performance

Les performances ont été comparées avec trois métriques :

- **MAE** (Mean Absolute Error)
- **RMSE** (Root Mean Square Error)
- **MAPE** (Mean Absolute Percentage Error)

| Modèle  | Test            | MAPE (%) | MAE    | RMSE   |
| ------- | --------------- | -------- | ------ | ------ |
| ARIMA   | Test individuel | 12.39    | 83.56  | 100.67 |
| ARIMA   | AutoGluon       | 25.63    | 150.26 | 173.68 |
| Chronos | Test individuel | 6.11     | 40.63  | 48.22  |
| Chronos | AutoGluon       | 6.11     | 40.63  | 48.22  |

👉 Le modèle **Chronos-Bolt-Base** avec AutoGluon a surpassé les deux versions d'ARIMA sur tous les critères.

## 🛠️ Développement du Dashboard

Le dashboard a été développé avec **React** et **Vite.js**. Il permet :

- De visualiser les ventes passées et les prédictions futures
- D'interagir avec les données via des graphiques dynamiques
- D'explorer les résultats avec des fonctionnalités adaptées aux personnes en situation de handicap (respect des critères WCAG)

### 📂 Structure du dossier

Le code du dashboard se trouve dans le répertoire :

```
./dashboard
```

## 🚀 Installation et Exécution

### Prérequis

- Node.js 18+
- Gestionnaire de paquets (npm ou yarn)

### Commandes d'installation

```bash
cd dashboard
npm install
```

### Lancement du dashboard

```bash
npm run dev
```

Le dashboard sera accessible localement à l'adresse :

```
http://localhost:5173
```

## 🔗 Références

- [Chronos Forecasting - Amazon Science](https://github.com/amazon-science/chronos-forecasting)
- [Article scientifique Chronos](https://arxiv.org/abs/2403.07815)
- [Paper Review Chronos](https://andlukyane.com/blog/paper-review-chronos)

---

🎯 **Conclusion** : Le modèle **Chronos-Bolt-Base** a démontré sa supériorité par rapport à ARIMA. Son intégration dans un dashboard interactif et accessible, combinée à l'optimisation via AutoGluon, valide la faisabilité de ce type de modèles dans un environnement professionnel.

👨‍💻 Réalisé par : [Krock13](https://github.com/Krock13)

💡 Formation : AI Engineer - OpenClassrooms | Projet 9
