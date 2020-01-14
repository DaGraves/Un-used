import React from "react";
import { View, Text, Platform, Alert } from "react-native";
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { Button, Spinner } from "native-base"
import styles from "../styles/Home/Post.styles";
import { observer } from "mobx-react";
import { Post } from "../stores";
import {
  STRIPE_PUB_KEY,
  ANDROID_PAY_MODE,
  APPLE_MERCHANT_ID
} from 'react-native-dotenv'

@observer
class PayButton extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      canUseWallet:false
    }
  }

  async componentDidMount(){
    try{
      let canUseWallet = false

      await Stripe.setOptionsAsync({
        publishableKey: STRIPE_PUB_KEY, // Your key
        androidPayMode: ANDROID_PAY_MODE, // [optional] used to set wallet environment (AndroidPay)
        merchantId: APPLE_MERCHANT_ID, // [optional] used for payments with ApplePay
      });

      if(Stripe){
        console.log(Stripe)
        canUseWallet = await Stripe.canMakeNativePayPaymentsAsync();
      }

      if(this.state.canUseWallet !== canUseWallet){
        this.setState({canUseWallet})
      }

    }catch(e){
      console.log(e);
    }

  }

  async initPayFunctionIos(post,charge){
    try{
      const { amount,currency,description } = charge
      const options = {
        total_price:amount,
        currencyCode:currency,
      }
      const items = [
        {
          label:description,
          amount:amount
        }
      ]

      const token = await Stripe.paymentRequestWithApplePayAsync(items,options)

      await Stripe.completeApplePayRequestAsync();
      return token

    }catch(e){
      console.log(e)
      Stripe.cancelApplePayRequestAsync()
      Post.createPostForm.isLoading = false
    }
  }

  async initPayFunctionAndroid(post,charge){
    try{
      const { amount,currency,description } = charge
      const options = {
        total_price:amount,
        shipping_address_required:false,
        billing_address_required:false,
        currency_code:currency,
        line_items:[
          {
            currency_code:currency,
            description:description,
            total_price:amount,
            unit_price:amount,
            quantity:"1"
          }
        ]
      }

      const token = await Stripe.paymentRequestWithAndroidPayAsync(options)
      return token

    }catch(e){
      console.log(e)
      Post.createPostForm.isLoading = false
    }
  }

  async requestPayment(){
    try{
      const post = await Post.createPost();
      const charge = {
        amount:"100", // in cents
        currency:"USD",
        description:`Paid to post picture in Taux with ID: ${post.id}`
      }
      const initPayFunction = Platform.select({
        ios:this.initPayFunctionIos,
        android:this.initPayFunctionAndroid
      })
      const token = await initPayFunction(post,charge)
      console.log("TOKEN: ", token);
      console.log("charge: ", charge);
      const resultPayment = await Post.payPost(post,token.tokenId,charge)
      if(resultPayment){
        return await this.props.submit()
      }
      alert("Failed to complete payment")
      Post.createPostForm.isLoading = false

    }catch(e){
      alert(e)
      Post.createPostForm.isLoading = false
    }
    // await this.props.submit()
  }

  render() {

    const isDisabled = this.props.disabled || !this.state.canUseWallet
    const isLoading = this.props.isLoading

    return (
      <Button
        primary
        disabled={isDisabled}
        style={styles.cameraActionsBottomIconWrapper}
        onPress={async () => await this.requestPayment()}
      >
        <Text style={styles.confirmActionText}>Confirm</Text>
        {isLoading && (
          <Spinner width="30" color="blue" />
        )}
      </Button>
    );
  }
}

export default PayButton;
