import type { Maybe } from "./types";

// Source: the final paper, the ETECOM 2026 certificate and the conference slides.
export const research = {
  title:
    "A Comparative Study of Fine-Tuned MARBERTv2 for Arabic Dialect Identification on the IADD Benchmark",
  // Author order as printed on the paper, slides and code README.
  // TODO(hamza): your résumé lists you first ("H. Alkhaldi, H. Wahban, M. Khan"); the paper lists Hana first.
  // Use whichever order IEEE will publish and make the résumé match.
  authors: ["Hana Wahban", "Hamza Alkhaldi", "Maqbool Khan"],
  self: "Hamza Alkhaldi",
  affiliation: "College of Engineering & Computing, American University of Bahrain",
  venue: "2026 International Conference on Emerging Trends in Engineering and Computing (IEEE ETECOM)",
  venueShort: "IEEE ETECOM 2026",
  location: "Paris, France",
  dates: "26–27 October 2026",
  status: "Accepted · Oral presentation · To appear in IEEE Xplore",
  doi: { todo: "DOI / IEEE Xplore link once published" } as Maybe<string>,
  abstract:
    "Arabic dialects differ from Modern Standard Arabic (MSA) and from each other in vocabulary and word structure, which reduces the accuracy of NLP systems trained only on MSA. We fine-tune MARBERTv2 to identify four main dialects — Egyptian, Gulf, Levantine and Maghrebi — on the Integrated Arabic Dialect Identification Dataset (IADD), after removing duplicates and conflicting labels, with one fixed split shared by every model. MARBERTv2 is compared with three classical models on tuned TF-IDF features and three other Arabic transformers. It reaches 89.83 ± 0.42% accuracy and a macro F1 of 0.8982, 4.15 points above the strongest classical model, Naïve Bayes — at the cost of 330 s of training versus 8 s. A frozen linear probe reaches only 84.91%, while fine-tuning just the last two layers recovers about two-thirds of the gain in under half the training time.",
  keyResults: [
    { value: "89.83%", label: "MARBERTv2 accuracy (± 0.42, 5 seeds)" },
    { value: "+4.15 pts", label: "over Naïve Bayes, the best classical model" },
    { value: "330 s vs 8 s", label: "training cost: transformer vs Naïve Bayes" },
    { value: "≈ ⅔ of the gain", label: "from fine-tuning only the last 2 layers" },
  ],
  whatIDid: [
    // TODO(hamza): adjust to your exact contribution.
    "Co-designed the experimental protocol: cleaning, a fixed train/validation/test split and 5-seed evaluation.",
    "Fine-tuned and benchmarked MARBERTv2, AraBERT, CAMeLBERT-DA and AraBART against tuned TF-IDF baselines.",
    "Measured the accuracy-versus-cost trade-off: training and inference time, GPU memory and energy.",
    "Presented the paper orally at IEEE ETECOM 2026 in Paris.",
  ],
  links: {
    code: "https://github.com/backon74/MARBERTv2-Arabic-Dialect-ID-IADD",
    certificate: "/research/etecom2026-certificate.pdf",
    slides: "/research/etecom2026-slides.pdf", // provided (exported from the conference .pptx)
    paper: null as string | null, // keep null until IEEE allows hosting the PDF
  },
  citationIEEE:
    'H. Wahban, H. Alkhaldi, and M. Khan, "A Comparative Study of Fine-Tuned MARBERTv2 for Arabic Dialect Identification on the IADD Benchmark," in Proc. 2026 Int. Conf. Emerging Trends in Engineering and Computing (ETECOM), Paris, France, Oct. 2026, to appear.',
  // Figures extracted from the conference slides (provided — copy from kit/assets/images/research/).
  figures: [
    { src: "/images/research/fig-accuracy-vs-cost.png", alt: "Scatter plot of test accuracy versus training time on a log scale: MARBERTv2 is most accurate at about 330 s; Naive Bayes reaches 85.7% in about 8 s", caption: "Accuracy vs. training time — +4.15 pts for ≈41× the training time" },
    { src: "/images/research/fig-accuracy.png", alt: "Bar chart of test accuracy for all seven models", caption: "Test accuracy of all seven models" },
    { src: "/images/research/fig-finetune-depth.png", alt: "MARBERTv2 accuracy at four fine-tuning depths compared with Naive Bayes", caption: "Fine-tuning depth: the last 2 layers recover about two-thirds of the gain" },
    { src: "/images/research/fig-confusion.png", alt: "Confusion matrix of MARBERTv2 across Egyptian, Gulf, Levantine and Maghrebi", caption: "MARBERTv2 confusion matrix" },
    { src: "/images/research/fig-pipeline.png", alt: "Experimental pipeline from IADD cleaning through classical and transformer models to evaluation", caption: "Experimental pipeline" },
  ],
  tags: ["Arabic NLP", "Transformers", "Fine-tuning", "MARBERTv2", "TF-IDF baselines"],
} as const;
