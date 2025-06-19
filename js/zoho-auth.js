// Zoho Commerce API Configuration
const ZOHO_CONFIG = {
    clientId: '1000.5LX7HRNCBX104M7IG3XYOKUGBRZCWO',
    clientSecret: '6136984cc3921836c7722825751765f93c6c3530f3',
    organizationId: '766739843',
    redirectUri: 'http://localhost:5500/oauth-callback.html', // Change 5500 to your port
    apiDomain: 'commerce.zoho.com'
};

// Step 1: Create the authorization URL
function createAuthorizationUrl() {
    // IMPORTANT: Updated scope to include all necessary permissions
    // for products, reading/creating sites, and creating pages.
    const scopes = [
       // 'ZohoCommerce.products.READ',
        'ZohoCommerce.items.READ',
        'ZohoCommerce.sitesIndex.READ',
       // 'ZohoCommerce.storefront.READ',
        //'ZohoCommerce.cart.all',
       // 'ZohoCommerce.checkout.all',
         // For Get All Stores
      // 'ZohoCommerce.sites.CREATE',    // For Create Store
        'ZohoCommerce.pages.CREATE'     // For Add Page
    ].join(','); // Join multiple scopes with a comma

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: ZOHO_CONFIG.clientId,
        scope: scopes, // Use the combined scopes here
        redirect_uri: ZOHO_CONFIG.redirectUri,
        access_type: 'offline',
        prompt: 'consent'
    });
    
    return `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`;
}

// Step 2: Start the OAuth process
function startOAuthProcess() {
    const authUrl = createAuthorizationUrl();
    console.log('Authorization URL:', authUrl);
    
    // This will redirect user to Zoho login
    window.location.href = authUrl;
}