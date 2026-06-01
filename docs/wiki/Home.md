This wiki documents the code repository for [Oslo Mobile Orchestra (OMO)](https://www.uio.no/ritmo/english/research/labs/fourms/research/projects/omo/), a multi–human–multi–machine approach to musicking.

- **Live hub:** [fourms.github.io/omo/](https://fourms.github.io/omo/)
- **Repo:** [github.com/fourMs/omo](https://github.com/fourMs/omo/)

## About OMO

Oslo Mobile Orchestra (OMO) is an ad-hoc ensemble of students and researchers from the University of Oslo and the Norwegian Academy of Music. It was founded in 2009 as the Oslo iPhone Ensemble and renamed in 2012 when patches began working across iOS and Android.

OMO treats mobile phones as real-time instruments, not as controllers or music production devices. The ensemble's working rules are simple:

- Sound comes from the phones; we generally don't use external amplification
- Performers embrace the digital possibilities of the medium (sensors, synthesis, shared timing)
- Playing together is a social activity, including listening, and ensemble roles matter

This site is the current **browser-based collection of instruments** for OMO workshops and performances. It replaces earlier PureData patches deployed via MobMuPlat with Web Audio apps that run in the browser on participants' own phones.

New performers are welcome — see the [OMO project page](https://www.uio.no/ritmo/english/research/labs/fourms/research/projects/omo/) for background, history, and contact.

## Wiki pages

| Page | Topic |
|------|--------|
| [App catalog](App-Catalog) | Every instrument with synthesis role and sensors (56 apps) |
| [Workshop guide](Workshop-Guide) | Before the room, 45 min script, troubleshooting |
| [Browsers & hardware](Browsers-and-Hardware) | iOS / Android, sensors, volume |
| [Ensemble sync](Ensemble-Sync) | Conductor, Firefly, Harmonizer |
| [Architecture](Architecture) | Shared code, PWA, offline cache |

In-repo copies: [`docs/CATALOG.md`](https://github.com/fourMs/omo/blob/main/docs/CATALOG.md) · [`docs/WORKSHOP-GUIDE.md`](https://github.com/fourMs/omo/blob/main/docs/WORKSHOP-GUIDE.md)

## In every app

- **Learn** — instructions overlay
- **QR** — share this instrument's URL
- **Audio on/off** — unlock Web Audio (required on iOS)
