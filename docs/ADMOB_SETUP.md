# 📱 Configuração de Anúncios AdMob - Guia Rápido

## 🚀 Como Configurar para Produção

### Passo 1: Criar Conta no AdMob
1. Acesse: https://apps.admob.google.com
2. Faça login com sua conta Google
3. Clique em "Começar" e siga o wizard

### Passo 2: Criar seu App no AdMob
1. No painel do AdMob, clique em "Apps" → "Adicionar App"
2. Selecione a plataforma (iOS/Android)
3. Preencha as informações do app
4. Anote o **App ID** gerado (ex: `ca-app-pub-1234567890123456~1234567890`)

### Passo 3: Criar Ad Units
Para cada tipo de anúncio, crie um Ad Unit:

#### Banner Ad
1. Vá em "Ad Units" → "Criar Ad Unit"
2. Selecione "Banner"
3. Dê um nome (ex: "Home Banner")
4. Copie o **Ad Unit ID** gerado (ex: `ca-app-pub-1234567890123456/1234567890`)

#### Interstitial Ad
1. Crie outro Ad Unit
2. Selecione "Interstitial"
3. Nome: "Pack Open Interstitial"
4. Copie o ID

#### Rewarded Ad (Opcional)
1. Crie Ad Unit
2. Selecione "Rewarded"
3. Nome: "Premium Unlock Rewarded"
4. Copie o ID

#### App Open Ad (Opcional)
1. Crie Ad Unit
2. Selecione "App Open"
3. Nome: "App Launch Ad"
4. Copie o ID

### Passo 4: Configurar no Código

Abra o arquivo: `src/config/adConfig.ts`

Substitua os placeholders pelos seus IDs reais:

```typescript
// iOS
const PRODUCTION_IOS_BANNER = 'ca-app-pub-1234567890123456/1234567890'; // ← Cole seu ID aqui
const PRODUCTION_IOS_INTERSTITIAL = 'ca-app-pub-1234567890123456/0987654321';
const PRODUCTION_IOS_REWARDED = 'ca-app-pub-1234567890123456/1111111111';
const PRODUCTION_IOS_APP_OPEN = 'ca-app-pub-1234567890123456/2222222222';

// Android
const PRODUCTION_ANDROID_BANNER = 'ca-app-pub-1234567890123456/3333333333';
const PRODUCTION_ANDROID_INTERSTITIAL = 'ca-app-pub-1234567890123456/4444444444';
const PRODUCTION_ANDROID_REWARDED = 'ca-app-pub-1234567890123456/5555555555';
const PRODUCTION_ANDROID_APP_OPEN = 'ca-app-pub-1234567890123456/6666666666';
```

### Passo 5: Configurar app.json / app.config.js

Adicione o App ID do AdMob no arquivo de configuração do Expo:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-1234567890123456~1234567890",
          "iosAppId": "ca-app-pub-1234567890123456~0987654321"
        }
      ]
    ]
  }
}
```

### Passo 6: Build e Teste

```bash
# Build de desenvolvimento (usa Test IDs)
eas build --profile development --platform android

# Build de produção (usa IDs reais)
eas build --profile production --platform android
```

## ⚙️ Ajustar Frequência dos Anúncios

No arquivo `src/config/adConfig.ts`, ajuste:

```typescript
export const AdConfig = {
  // Mostra 1 interstitial a cada X navegações
  INTERSTITIAL_FREQUENCY: 3, // ← Ajuste aqui (2, 3, 4, 5...)
  
  // Tempo mínimo entre interstitials (segundos)
  INTERSTITIAL_MIN_INTERVAL: 60,
  
  // Habilitar/desabilitar ads globalmente
  ADS_ENABLED: true,
};
```

## 📊 Onde os Anúncios Aparecem

### Banner Ads
- ✅ **DetailsScreen** (rodapé, ao abrir pack de stickers)

### Interstitial Ads
- ✅ **DetailsScreen** (ao abrir pack - 1 a cada 3 aberturas)
- ✅ **AnimeDetailsScreen** (ao abrir anime - 1 a cada 3 aberturas)

### Native Ads
- ✅ **HomeScreen** (inseridos na lista de packs - 1 a cada 4 itens)

## ⚠️ Avisos Importantes

1. **NUNCA clique nos seus próprios anúncios reais** - Isso pode banir sua conta do AdMob
2. **Use Test IDs em desenvolvimento** - O código já faz isso automaticamente
3. **Aguarde aprovação do AdMob** - Pode levar 24-48h para os anúncios começarem a aparecer
4. **Respeite políticas do AdMob** - Leia: https://support.google.com/admob/answer/6128543

## 🐛 Troubleshooting

### "Ads não aparecem em produção"
- Verifique se os IDs estão corretos em `adConfig.ts`
- Aguarde 24-48h após criar os Ad Units
- Verifique se o app foi aprovado no AdMob

### "Erro: Invalid Ad Unit ID"
- Confirme que copiou o ID completo (incluindo `ca-app-pub-`)
- Verifique se não há espaços extras
- Certifique-se de usar o ID correto para cada plataforma (iOS/Android)

### "Ads aparecem em DEV mas não em PROD"
- Verifique se `__DEV__` está false no build de produção
- Confirme que os IDs de produção foram configurados
- Rode `validateAdConfig()` para ver avisos

## 📞 Suporte

- Documentação AdMob: https://developers.google.com/admob
- Políticas: https://support.google.com/admob/answer/6128543
- Suporte: https://support.google.com/admob

---

✅ **Pronto!** Depois de configurar, basta fazer o build de produção e publicar. Os anúncios funcionarão automaticamente!
