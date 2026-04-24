return (
  <div className="min-h-screen flex items-center justify-center bg-[#0f172a] dark:bg-slate-950 px-4 py-10">

    <div className="w-full max-w-[1100px] min-h-[640px] rounded-2xl overflow-hidden border border-white/10 shadow-xl flex flex-col lg:flex-row">

      {/* ================= FORMULAIRE (GAUCHE) ================= */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-slate-900 p-8 flex items-center">
        <div className="w-full max-w-md mx-auto">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inscription formateur
          </h1>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Votre compte sera <strong>en attente de validation</strong>.
          </p>

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>

            <ChampSaisie label="Nom" type="text" name="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            <ChampSaisie label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <ChampSaisie label="Mot de passe" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <ChampSaisie label="Spécialité" type="text" name="specialite" value={specialite} onChange={(e) => setSpecialite(e.target.value)} />
            <ChampSaisie label="Expérience" type="text" name="experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
            <ChampSaisie label="Portfolio (URL)" type="text" name="portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
            <ChampSaisie label="LinkedIn (URL)" type="text" name="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            <ChampSaisie label="GitHub (URL)" type="text" name="github" value={github} onChange={(e) => setGithub(e.target.value)} />

            {/* CV */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                CV (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvFileName(e.target.files?.[0]?.name ?? "")}
                className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-900"
              />
              {cvFileName && (
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Fichier: {cvFileName}
                </p>
              )}
            </div>

            <ChampSaisie
              label="Preuve complémentaire"
              type="text"
              name="preuve"
              value={preuve}
              onChange={(e) => setPreuve(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600">
              Envoyer la demande
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600 dark:text-slate-400">
            Déjà un compte ?{" "}
            <Link to="/connexion-formateur" className="text-blue-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>

          <Link to="/" className="mt-4 block text-center text-sm text-gray-500 hover:underline">
            ← Retour au site
          </Link>

        </div>
      </div>

      {/* ================= IMAGE (DROITE) ================= */}
      <div className="hidden lg:flex w-1/2 bg-[#f5e6db] dark:bg-slate-800 items-center justify-center">
        <img
          src="/Hero.png"  // 🔥 même image que connexion
          alt="illustration"
          className="w-full h-full object-contain"
        />
      </div>

    </div>
  </div>
);